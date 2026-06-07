CREATE TABLE expenses (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	merchant VARCHAR(255) NOT NULL, 
	category VARCHAR(100) NOT NULL, 
	amount FLOAT NOT NULL, 
	date DATE NOT NULL, 
	status VARCHAR(50), 
	icon VARCHAR(100), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
