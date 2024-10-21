// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the cookies by setting them to empty and their expiration to the past
  res.setHeader("Set-Cookie", [
    serialize("authToken", "", {
      path: "/",
      expires: new Date(0), // Set cookie expiration to the past
    }),
    // Add more cookies here if needed
  ]);

  // Send response
  res.status(200).json({ message: "Logout successful" });
}
