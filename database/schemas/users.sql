CREATE TABLE users (
	id SERIAL NOT NULL, 
	clerk_id VARCHAR NOT NULL, 
	name VARCHAR, 
	email VARCHAR, 
	avatar_url VARCHAR, 
	phone VARCHAR, 
	is_active BOOLEAN, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
)
;
