CREATE TABLE user_settings (
	id SERIAL NOT NULL, 
	user_id INTEGER NOT NULL, 
	notifications_email BOOLEAN, 
	notifications_push BOOLEAN, 
	notifications_sms BOOLEAN, 
	theme VARCHAR(50), 
	currency VARCHAR(10), 
	language VARCHAR(10), 
	two_factor_enabled BOOLEAN, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
