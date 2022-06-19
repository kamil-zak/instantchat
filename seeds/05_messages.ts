import { Knex } from 'knex'

let counter = 0
const getNextTime = () => {
    const fiveHours = 1000 * 60 * 60 * 5
    const time = new Date().getTime() - fiveHours + counter * 60000
    counter += 1
    return new Date(time)
}

export async function seed(knex: Knex): Promise<void> {
    await knex('messages').insert([
        { id: 1, conversationId: 1, content: 'Hello', isResponse: false, read: true, time: getNextTime() },
        { id: 2, conversationId: 1, content: 'Hi', isResponse: true, read: true, time: getNextTime() },
        { id: 3, conversationId: 1, content: 'I need help!', isResponse: false, read: true, time: getNextTime() },
        { id: 4, conversationId: 1, content: 'Tell me what is your problem', isResponse: true, read: true, time: getNextTime() },
        { id: 5, conversationId: 2, content: 'Is it possible to pay by card?', isResponse: false, read: true, time: getNextTime() },
        { id: 6, conversationId: 2, content: 'Yes, of course!', isResponse: true, read: true, time: getNextTime() },
        { id: 7, conversationId: 2, content: 'Thank you', isResponse: false, read: true, time: getNextTime() },
        { id: 8, conversationId: 2, content: 'No problem.', isResponse: true, read: true, time: getNextTime() },
        { id: 9, conversationId: 3, content: 'Good morning', isResponse: false, read: true, time: getNextTime() },
        { id: 10, conversationId: 3, content: 'Welcome', isResponse: true, read: true, time: getNextTime() },
        { id: 11, conversationId: 3, content: 'Sorry, my problem is solved', isResponse: false, read: true, time: getNextTime() },
        { id: 12, conversationId: 3, content: 'Okay :D', isResponse: true, read: true, time: getNextTime() },
        { id: 13, conversationId: 4, content: 'Hi', isResponse: false, read: true, time: getNextTime() },
        { id: 14, conversationId: 4, content: 'Hello', isResponse: true, read: true, time: getNextTime() },
    ])
}
