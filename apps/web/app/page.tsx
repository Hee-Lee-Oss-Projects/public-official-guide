import { auth } from "@clerk/nextjs/server"

export default async function Home() {
  const session = await auth()

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Public Official Guide</h1>
      {session?.userId ? (
        <>
          <p>Welcome! You are authenticated.</p>
          <p>User ID: {session.userId}</p>
        </>
      ) : (
        <p>Please sign in to continue.</p>
      )}
    </main>
  )
}
