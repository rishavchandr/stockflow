import prisma from "../../db/index.js";

export const getDashboard = async (req, res, next) => {
    try {
        const orgId = req.user.orgId
        const settings = await prisma.settings.findUnique({
            where: { orgId }
        })
        const defaultThreshold = settings?.defaultLowStockThreshold ?? 5

        const [totalProducts, aggregates, allProducts] = await prisma.$transaction(
            [prisma.product.count({ where: { orgId } }),
            prisma.product.aggregate({
                where: { orgId },
                _sum: { quantityOnHand: true }
            }),
            prisma.product.findMany({
                where: { orgId },
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    quantityOnHand: true,
                    lowStockThreshold: true
                }
            })
            ])

        const lowStockItems = allProducts
            .map((p) => ({
                ...p,
                effectiveThreshold: p.lowStockThreshold ?? defaultThreshold
            }))
            .filter((p) => p.quantityOnHand <= p.effectiveThreshold)
            .sort((a, b) => a.quantityOnHand - b.quantityOnHand)

        res.status(200).json({
            totalProducts,
            totalQuantityOnHand: aggregates._sum.quantityOnHand ?? 0,
            lowStockCount: lowStockItems.length,
            lowStockItems,
            defaultLowStockThreshold: defaultThreshold
        })

    } catch (error) {
        next(error)
    }
}