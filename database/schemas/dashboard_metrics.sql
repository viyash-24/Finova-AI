CREATE TABLE dashboard_metrics (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	metric_name VARCHAR(100) NOT NULL, 
	value FLOAT NOT NULL, 
	change_pct FLOAT, 
	period VARCHAR(50), 
	icon VARCHAR(100), 
	trend VARCHAR(50), 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)
;
