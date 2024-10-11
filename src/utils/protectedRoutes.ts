export interface ProtectedRoutes {
      title: string;
      path: string;
      regex: RegExp;
      roles: string[] | "All";  // Roles are now represented as strings, matching the enum values in your database
    }
    
    export const protectedRoutes: ProtectedRoutes[] = [
      {
        title: "User Management",
        path: "/admin/user",
        regex: /\/admin\/user(\/|)[A-Za-z]?/i,
        roles: ["admin"],  // 'admin' role for managing users
      },
      {
        title: "Room Management",
        path: "/admin/room",
        regex: /\/admin\/room(\/|)[A-Za-z]?/i,
        roles: ["admin"],  // 'admin' role for managing rooms
      },
      {
        title: "Room Type Management",
        path: "/admin/room-type",
        regex: /\/admin\/room-type(\/|)[A-Za-z]?/i,
        roles: ["admin"],  // 'admin' role for managing room types
      },
      {
        title: "Transactions",
        path: "/resepsionis/transaksi",
        regex: /\/resepsionis\/transaksi(\/|)[A-Za-z]?/i,
        roles: ["resepsionis"],  // 'resepsionis' role for handling transactions
      },
      // {
      //   title: "History",
      //   path: "/resepsionis/history",
      //   regex: /\/resepsionis\/history(\/|)[A-Za-z]?/i,
      //   roles: ["resepsionis"],  // 'resepsionis' role for viewing history
      // },
      // {
      //   title: "Records",
      //   path: "/admin/records",
      //   regex: /\/admin\/records(\/|)[A-Za-z]?/i,
      //   roles: ["admin"],  // 'admin' role for viewing records
      // },
    ];
    