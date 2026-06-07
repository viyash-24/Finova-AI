CREATE TABLE goals (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	title VARCHAR(255) NOT NULL, 
	icon VARCHAR(100), 
	target_amount FLOAT NOT NULL, 
	current_amount FLOAT, 
	est_date DATE, 
	status VARCHAR(50), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
