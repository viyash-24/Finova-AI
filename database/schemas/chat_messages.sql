CREATE TABLE chat_messages (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	role VARCHAR(50) NOT NULL, 
	content TEXT NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
