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

      let softwareList = result.data.values.filter(row => row[0] === 'app')
      let commandList = result.data.values.filter(row => row[0] === 'command')

      softwareList = softwareList.map(row => ({
        name: row[1],
        icon: row[2],
        path: row[3],
        website: row[5],
        category: row[0],
        round: parseInt(row[6], 10)
      })) as any[]

      commandList = commandList.map(row => ({
        name: row[1],
        icon: row[2],
        desc: row[3],
        command: row[4],
        website: row[5],
        category: row[0],
        round: parseInt(row[6], 10)
      })) as any[]

      response.status(200).send([...softwareList, ...commandList])
    } else {
      response.status(200).send([])
    }
  } catch (err) {
    response.status(500).send(`Internal Server Error (${err instanceof Error ? err.message : 'Unknown error'})`)
  }
}
