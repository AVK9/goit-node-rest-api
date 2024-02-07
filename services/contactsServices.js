const { nanoid } = require("nanoid");
const fs = require("node:fs/promises");
const path = require("path");

const contactPath = path.join(process.cwd(), "db/contacts.json");

const listContacts = async () => {
    const data = await fs.readFile(contactPath);
    return JSON.parse(data);
}
const getContactById = async (id) => {
    const contacts = await listContacts();
    const resalt = contacts.find(item => item.id === id);
    return resalt || null;
}

const addContact = async (data) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data,
    }
    contacts.push(newContact);
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    return newContact;
}
const updateById = async (id, data) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if (index === -1) {
        return null;
    }
    contacts[index] = { id, ...data };
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
}

 const removeContact = async (id)=> {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
     await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
     return result;
}


module.exports = {
    listContacts,
    getContactById,
    addContact,
    updateById,
    removeContact,
}