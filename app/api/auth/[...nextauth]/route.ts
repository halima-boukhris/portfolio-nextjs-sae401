import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcrypt"; 

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        username: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        
        const [rows]: any = await pool.query(
          "SELECT * FROM admins WHERE username = ?", 
          [credentials?.username]
        );
        
        const user = rows[0];

        
        if (user && credentials?.password) {
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (isPasswordValid) {
            return { id: user.id.toString(), name: user.username };
          }
        }
        
        return null; 
      }
    })
  ],
  
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };