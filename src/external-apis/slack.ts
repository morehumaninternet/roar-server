import axios from 'axios'

export async function sendMessageIfNewUser(user: User): Promise<any> {
  if (process.env.NODE_ENV === 'prod') {
    // We can tell the user is new if the created timestamp is the same as the updated timestamp because the upsert will update the user on subsequent logins
    const userIsNew = user.created_at.valueOf() !== user.updated_at.valueOf()

    if (userIsNew) {
      const emailText = user.email ? ` ${user.email}` : ''
      const text = `New user logged in! twitter.com/${user.twitter_handle}${emailText}`
      return axios.post(process.env.SLACK_WEBHOOK_URL!, { text })
    }
  }
}
