import { getGoogleSheetsClients } from '../common/googleSheets'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { token = '' } = request.query

  if (token !== process.env.TOKEN) { 
    return response.status(401).send('Unauthorized')
  }

  try {
    const { auth, sheets } = await getGoogleSheetsClients(process.env.CLIENT_EMAIL!, process.env.PRIVATE_KEY!)

    const result = await sheets.spreadsheets.values.get({
      auth,
      range: 'Sheet1',
      spreadsheetId: process.env.SHEET_ID as string
    })

    if (result.data.values) {
      result.data.values = result.data.values.filter(row => row.length)
      response.status(200).send(result.data.values.map(row => ({
        name: row[0],
        icon: row[1],
        link: row[3],
        command: row[2],
        category: row[4]
      })))
    } else {
      response.status(200).send([])
    }
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err instanceof Error ? err.message : 'Unknown error'})`)
  }
}
