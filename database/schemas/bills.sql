CREATE TABLE bills (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	name VARCHAR(255) NOT NULL, 
	category VARCHAR(100) NOT NULL, 
	amount FLOAT NOT NULL, 
	due_date DATE NOT NULL, 
	is_recurring BOOLEAN, 
	status VARCHAR(50), 
	icon VARCHAR(100), 
	provider VARCHAR(255), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
