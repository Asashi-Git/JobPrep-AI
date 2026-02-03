// let userName = "Anuc";

// // Creating a variable of the needed security level ! 10 is the standard.
// const securityLevel = 10;

// async function register(userPassword){
//   try{
//     console.log(`User ${userName} typed this password ${userPassword}`);
//     const hashedPassword = await bcrypt.hash(userPassword, securityLevel);
//     console.log(`This password is the hash that we store ${hashedPassword}`);
//     return hashedPassword;
//   } catch (error) {
//     console.error("Hashing failed", error);
//   }
// }

// // test
// async function login(inputPassword, storedHashFromDB){
//   try{
//     console.log(`Attempting login with ${inputPassword}`);
//     const match = await bcrypt.compare(inputPassword, storedHashFromDB)

//     if (match) {
//       console.log(`The password ${inputPassword} match`);
//       return true;
//     } else {
//       console.log(`The password ${inputPassword} don't match`);
//       return false;
//     } 
//   } catch (error) {
//     console.error("Comparison error", error);
//   }
// };


register = async (req, res) => {
    // 1. Déstructuration et Validation des entrées
    // On extrait username, email et password du corps de la requête
    const { username, email, password } = req.body;

    // Vérification basique (Fail Fast)
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    try {
        // 2. Vérification de l'existence de l'utilisateur (par email)
        // On utilise '?' pour éviter les injections SQL (Prepared Statements)
        const [existingUsers] = await db.query(
            'SELECT id_user FROM users WHERE email = ?', 
            [email]
        );

        if (existingUsers.length > 0) {
            // Conflit : L'utilisateur existe déjà
            return res.status(409).json({ error: "Cet email est déjà utilisé." });
        }

        // 3. Hachage du mot de passe
        // C'est ici que la magie de bcrypt opère. C'est une opération lente (volontairement).
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 4. Insertion dans la base de données
        // Notez que created_at est géré automatiquement par MySQL
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // 5. Réponse de succès
        // On renvoie l'ID créé, mais JAMAIS le mot de passe
        res.status(201).json({ 
            message: "Utilisateur créé avec succès",
            userId: result.insertId 
        });

    } catch (error) {
        // 6. Gestion globale des erreurs
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
};


// app.post("/createUser", async (req,res) => {
//   const user = req.body.name;
//   const hashedPassword = await bcrypt.hash(req.body.password,15);
//   db.getConnection( async (error, connection) => {
//     if (error) throw (error)
//       const sqlSearch = "SELECT * FROM userTable WHERE user = ?"
//       const search_query = mysql.format(sqlSearch,[user])
//       const sqlInsert = "INSERT INTO userTable VALUES (0,?,?)"
//       const insert_query = mysql.format(sqlInsert,[user, hashedPassword])
//       // ? will be replaced by values
//       // ?? will be replaced by string
//       await connection.query (search_query, async (error, result) => {
//         if (error) throw (error)
//           console.log("------> Search Results")
//           console.log(result.length)
//           if (result.length != 0) {
//             connection.release()
//             console.log("------> User already exists")
//             res.sendStatus(409) 
//           } 
//           else {
//             await connection.query (insert_query, (error, result)=> {
//               connection.release()
//               if (error) throw (error)
//                 console.log ("--------> Created new User")
//                 console.log(result.insertId)
//                 res.sendStatus(201)
//           })
//       }
//     }) //end of connection.query()
//   }) //end of db.getConnection()
// }) //end of app.post()