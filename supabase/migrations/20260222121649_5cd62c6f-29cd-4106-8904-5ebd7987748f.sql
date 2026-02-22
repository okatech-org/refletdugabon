
-- Add length constraints to contact_messages table
ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT contact_messages_first_name_length CHECK (char_length(first_name) <= 100),
  ADD CONSTRAINT contact_messages_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT contact_messages_phone_length CHECK (char_length(phone) <= 30),
  ADD CONSTRAINT contact_messages_subject_length CHECK (char_length(subject) <= 200),
  ADD CONSTRAINT contact_messages_message_length CHECK (char_length(message) <= 5000);
