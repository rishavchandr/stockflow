import prisma from "../../db/index.js"

export const updateSettings = async (req, res, next) => {
  try {
    const orgId = req.user.orgId
    const { defaultLowStockThreshold } = req.body

    if (defaultLowStockThreshold === undefined || defaultLowStockThreshold === null) {
      return res.status(400).json({
        message: "Default low stock threshold is required."
      })
    }

    const threshold = parseInt(defaultLowStockThreshold)

    if (isNaN(threshold) || threshold < 0) {
      return res.status(400).json({
        message: "Threshold must be a positive number."
      })
    }

    const settings = await prisma.settings.upsert({
      where: { orgId },
      update: { defaultLowStockThreshold: threshold },
      create: {
        orgId,
        defaultLowStockThreshold: threshold
      }
    })

    res.status(200).json({
      message: "Settings updated successfully.",
      settings
    })

  } catch (error) {
    next(error)
  }
}

export const getSettings = async (req, res, next) => {
  try {
    const orgId = req.user.orgId

    let settings = await prisma.settings.findUnique({
      where: { orgId }
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          orgId,
          defaultLowStockThreshold: 5
        }
      })
    }

    res.status(200).json({ settings })

  } catch (error) {
    next(error)
  }
}
