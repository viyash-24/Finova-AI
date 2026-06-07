CREATE TABLE income_sources (
	id SERIAL NOT NULL, 
	user_id INTEGER NOT NULL, 
	source VARCHAR(255) NOT NULL, 
	amount FLOAT NOT NULL, 
	type VARCHAR(100) NOT NULL, 
	growth_pct FLOAT, 
	icon VARCHAR(100), 
	status VARCHAR(50), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
