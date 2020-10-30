import db from './db'

export function fetchSessionByUserId(user_id: number): Promise<Maybe<Session>> {
    return db<Session>('sessions').where('user_id', user_id).first()
}

export async function createSession(user_id: number, access_token: string, access_token_secret: string): Promise<Session> {

    const [session] = await db<Session>('sessions').insert({
        user_id,
        access_token,
        access_token_secret
    }).returning('*')

    return session
}

export async function updateSession(user_id: number, access_token: string, access_token_secret: string): Promise<Session> {

    const [session] = await db<Session>('sessions').where('user_id', user_id).update({
        access_token,
        access_token_secret
    }).returning('*')

    return session
}
