CREATE TABLE investments (
	id SERIAL NOT NULL, 
	user_id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	type VARCHAR(100) NOT NULL, 
	current_value FLOAT NOT NULL, 
	invested_amount FLOAT NOT NULL, 
	returns_pct FLOAT, 
	icon VARCHAR(100), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
