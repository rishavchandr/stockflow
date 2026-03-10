import prisma from "../../db/index.js"

export const getAllProducts = async (req, res, next) => {
    try {
        const { search } = req.query
        const orgId = req.user.orgId

        const where = {
            orgId,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { sku: { contains: search, mode: "insensitive" } },
                ],
            }),
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
        })

        const settings = await prisma.settings.findUnique({ where: { orgId } })
        const defaultThreshold = settings?.defaultLowStockThreshold ?? 5

        const result = products.map((p) => ({
            ...p,
            effectiveThreshold: p.lowStockThreshold ?? defaultThreshold,
            isLowStock: p.quantityOnHand <= (p.lowStockThreshold ?? defaultThreshold),
        }))

        res.status(200).json({ products: result })
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const orgId = req.user.orgId
        const { id } = req.params

        const product = await prisma.product.findFirst({
            where: { id, orgId },
        })

        if (!product) {
            return res.status(404).json({ message: "Product not found." })
        }

        const settings = await prisma.settings.findUnique({ where: { orgId } })
        const defaultThreshold = settings?.defaultLowStockThreshold ?? 5

        const result = {
            ...product,
            effectiveThreshold: product.lowStockThreshold ?? defaultThreshold,
            isLowStock:
                product.quantityOnHand <=
                (product.lowStockThreshold ?? defaultThreshold),
        }

        res.status(200).json({ product: result })
    } catch (error) {
        next(error)
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const orgId = req.user.orgId
        const {
            name,
            sku,
            description,
            quantityOnHand,
            costPrice,
            sellingPrice,
            lowStockThreshold,
        } = req.body

        if (!name || !sku) {
            return res
                .status(400)
                .json({ message: "Product name and SKU are required." })
        }

        const existingSku = await prisma.product.findFirst({
            where: { orgId, sku: sku.trim().toUpperCase() },
        })

        if (existingSku) {
            return res
                .status(409)
                .json({ message: `SKU "${sku}" already exists in your organization.` })
        }

        const product = await prisma.product.create({
            data: {
                orgId,
                name: name.trim(),
                sku: sku.trim().toUpperCase(),
                description: description?.trim() || null,
                quantityOnHand: parseInt(quantityOnHand) || 0,
                costPrice: costPrice ? parseFloat(costPrice) : null,
                sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
                lowStockThreshold: lowStockThreshold
                    ? parseInt(lowStockThreshold)
                    : null,
            },
        })

        res.status(201).json({
            message: "Product created successfully.",
            product,
        })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const orgId = req.user.orgId
        const { id } = req.params

        const existing = await prisma.product.findFirst({
            where: { id, orgId },
        })

        if (!existing) {
            return res.status(404).json({ message: "Product not found." })
        }

        const {
            name,
            sku,
            description,
            quantityOnHand,
            costPrice,
            sellingPrice,
            lowStockThreshold,
        } = req.body

        if (sku && sku.trim().toUpperCase() !== existing.sku) {
            const skuConflict = await prisma.product.findFirst({
                where: { orgId, sku: sku.trim().toUpperCase(), NOT: { id } },
            })

            if (skuConflict) {
                return res
                    .status(409)
                    .json({ message: `SKU "${sku}" already exists.` })
            }
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name && { name: name.trim() }),
                ...(sku && { sku: sku.trim().toUpperCase() }),
                description:
                    description !== undefined ? description?.trim() || null : undefined,
                ...(quantityOnHand !== undefined && {
                    quantityOnHand: parseInt(quantityOnHand),
                }),
                costPrice:
                    costPrice !== undefined
                        ? costPrice
                            ? parseFloat(costPrice)
                            : null
                        : undefined,
                sellingPrice:
                    sellingPrice !== undefined
                        ? sellingPrice
                            ? parseFloat(sellingPrice)
                            : null
                        : undefined,
                lowStockThreshold:
                    lowStockThreshold !== undefined
                        ? lowStockThreshold
                            ? parseInt(lowStockThreshold)
                            : null
                        : undefined,
            },
        })

        res.status(200).json({
            message: "Product updated successfully.",
            product,
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const orgId = req.user.orgId
        const { id } = req.params

        const existing = await prisma.product.findFirst({
            where: { id, orgId },
        })

        if (!existing) {
            return res.status(404).json({ message: "Product not found." })
        }

        await prisma.product.delete({ where: { id } })

        res.status(200).json({
            message: "Product deleted successfully.",
        })
    } catch (error) {
        next(error)
    }
}

export const adjustStock = async (req, res, next) => {
    try {
        const orgId = req.user.orgId
        const { id } = req.params
        const { adjustment } = req.body

        if (adjustment === undefined) {
            return res
                .status(400)
                .json({ message: "Adjustment value is required." })
        }

        const existing = await prisma.product.findFirst({
            where: { id, orgId },
        })

        if (!existing) {
            return res.status(404).json({ message: "Product not found." })
        }

        const newQuantity = existing.quantityOnHand + parseInt(adjustment)

        if (newQuantity < 0) {
            return res
                .status(400)
                .json({ message: "Stock cannot go below 0." })
        }

        const product = await prisma.product.update({
            where: { id },
            data: { quantityOnHand: newQuantity },
        })

        res.status(200).json({
            message: "Stock adjusted successfully.",
            product,
        })
    } catch (error) {
        next(error)
    }
}
