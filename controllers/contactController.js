const getContacts = (req, res) => {
    res.status(201)
    res.json({ message: "GET ALL CONTACTS" })
}

const getContact = (req, res) => {
    res.status(201)
    res.json({ message: `GET CONTACT for ID - ${req.params.id} ` })
}

const createContact = (req, res) => {
    res.status(201)
    res.json({ message: "Create a contact" })
}

const updateContact = (req, res) => {
    res.status(201)
    res.json({ message: `Update CONTACT for ID - ${req.params.id} ` })
}

const deleteContact = (req, res) => {
    res.status(201)
    res.json({ message: `Delete CONTACT for ID - ${req.params.id} ` })
}

module.exports = {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
}
