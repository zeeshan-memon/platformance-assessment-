import {pool} from '../../../../lib/db'
import {comparePasswords, signJwt} from '../../../../lib/auth'


export async function POST(req: Request) {

const body = await req.json();
try {
    if (!body.email || !body.password) {
        return Response.json({ response: 'Email and password are required' }, {status:200});
    }
          // Query the database to find the user by email
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [body.email]);

    if (result.rows.length === 0) {
        return Response.json({ response: 'Invalid email or password' }, {status:400});
    }

    const { email, id, password, userid } = result.rows[0];
    const user = { email, id, userid };
      // Compare the provided password with the hashed password in the database
    const isPasswordValid = await comparePasswords(body.password, password);

    if (!isPasswordValid) {
        return Response.json({ response: 'Invalid email or password' }, {status:400});
    }

    const token = signJwt(user);
    return Response.json({ response: {user, token} }, {status: 200});

    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error }, {status: 500});
    }

}