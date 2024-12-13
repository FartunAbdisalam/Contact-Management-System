const asyncHandler = require("express-async-handler");
const ContactDb = require ("../models/contactModel");

//@desc get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler( async(req, res) => {
  const contacts = await ContactDb.find({user_id: req.user.id});
  res.status(200).json(contacts)
});

//@desc get a contacts
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler( async(req, res) => {
  const contact = await ContactDb.findById(req.params.id);
  if(!contact)
  {
   res.status(404)
   throw new Error("Contact not found")
  }

  res.status(200).json(contact); 

})

//@desc create a contact
//@route POST /api/contacts/:id
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("request body is :", req.body);
  const {name, email, phone} = req.body;
  if (!name || !email || !phone){
    res.status(400)
    throw new Error("All fields are required")
  }
  const contact = await ContactDb.create({
    //passing the keys from req.body
    name,
    email,
    phone,
    //the middleware will decode each user request 
    // and attach the info into req.user
    user_id: req.user.id
  });
  res.status(201).json(contact);
});

//@desc update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler( async(req, res) => {
  //fetch the record 1st 
  const contact = await ContactDb.findById(req.params.id);
  if(!contact)
  {
   res.status(404)
   throw new Error("Contact not found")
  }

  //check if there is an unauthorized access
  if(contact.user_id.toString() !== req.user.id)
  {
    res.status(403)
    throw new Error("user don't have permission to update other users contacts")
  }

  //then update it
  const updatedContact = await ContactDb.findByIdAndUpdate(
    //passing the id of the contact,and req.body, set the new value to true
    req.params.id, 
    req.body,
    {new: true}
  );
  res.status(200).json(updatedContact);
});

//@desc delete a contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler( async(req, res) => {
  //fetch the record to delete 
  const contact = await ContactDb.findById(req.params.id);
  if(!contact)
  {
   res.status(404)
   throw new Error("Contact not found")
  }

  if(contact.user_id.toString() !== req.user.id)
    {
      res.status(403)
      throw new Error("user don't have permission to update other users contacts")
    }

  await ContactDb.deleteOne({_id: req.params.id});
  res.status(200).json(contact);
});


module.exports = {getContacts, getContact, createContact, updateContact,deleteContact}