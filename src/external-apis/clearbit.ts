import * as assert from 'assert'
import axios from 'axios'

if (process.env.NODE_ENV !== 'test') {
  assert.ok(process.env.CLEARBIT_SECRET_API_KEY) // tslint:disable-line:no-expression-statement
}

export async function getTwitterHandle(domain: string): Promise<null | string> {
  if (process.env.NODE_ENV === 'test') {
    throw new Error('Do not call when running tests')
  }

  try {
    const response = await axios.get(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLEARBIT_SECRET_API_KEY}`,
      },
    })

    const twitterHandle = response.data.twitter?.handle
    return twitterHandle && `@${twitterHandle}`
  } catch (err) {
    return console.error(err), null
  }
}
