CREATE TABLE ai_insights (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	category VARCHAR(100), 
	title VARCHAR(255) NOT NULL, 
	description VARCHAR, 
	severity VARCHAR(50), 
	icon VARCHAR(100), 
	action_label VARCHAR(100), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
