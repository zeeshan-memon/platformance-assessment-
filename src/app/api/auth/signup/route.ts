import {pool} from '../../../../lib/db'
import {hashPassword} from '../../../../lib/auth'
import { v4 as uuidv4 } from 'uuid'


export async function POST(req: Request) {

    const body = await req.json();
try {
    if (!body.email || !body.password) {
        return Response.json({ response: 'Email and password are required' }, {status:200});
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [body.email]);
    if (existingUser.rows.length > 0) {
        return Response.json({ response: 'Email is already registered' }, {status:400});
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(body.password);
    const userId = uuidv4()
         // Store data in PostgreSQL
    const result = await pool.query(
        'INSERT INTO users(email, password, userid) VALUES($1, $2, $3) RETURNING id',
        [body.email, hashedPassword, userId]
    );

    return Response.json({ response: result }, {status: 200});

    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error }, {status: 500});
    }

}