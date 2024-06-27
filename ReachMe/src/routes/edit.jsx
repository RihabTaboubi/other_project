import  { useState } from 'react';
import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom';
import { updateContact } from '../contacts';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(contact?.avatar);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }
    fetch(`/contacts/${contact.id}/edit`, {
      method: 'POST',
      body: formData,
    }).then(() => navigate(`/contacts/${contact.id}`));
  };

  return (
    <Form method="post" id="contact-form" encType="multipart/form-data" onSubmit={handleSubmit}>
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Email</span>
        <input
          type="text"
          name="email"
          placeholder="example@example.com"
          defaultValue={contact?.email}
        />
      </label>
      <label>
        <span>Profile Picture</span>
        <input
          type="file"
          name="avatar"
          onChange={handleFileChange}
          accept="image/*"
        />
        {preview && <img src={preview} alt="Preview" width="100" height="100" />}
      </label>
      <label>
        <span>Telephone Number</span>
        <PhoneInput
          country={'us'}
          value={contact?.telephone}
          onChange={(phone) => {
            const event = { target: { name: 'telephone', value: phone } };
            handleInputChange(event);
          }}
          inputProps={{
            name: 'telephone',
            required: true,
            autoFocus: true,
          }}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
