import app from "./app.js"
import prisma from "./database/index.js" 

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("Database connected successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })

  } catch (error) {
    console.error("Failed to connect to the database:", error)

    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()

process.on("SIGINT", async () => {
  await prisma.$disconnect()
  process.exit(0)
})