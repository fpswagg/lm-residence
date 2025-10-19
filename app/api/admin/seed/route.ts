export async function POST() {
  // This endpoint can be used to seed initial data
  // In a real application, this would populate a database
  return Response.json({ success: true, message: "Data seeded successfully" })
}
