# To Run application

## Start and SSH into Vagrant VM 

```
vagrant up
vagrant ssh servidorWeb
```

## Run the webApp

```
cd /home/vagrant/frontend
export FLASK_APP=run.py
/usr/local/bin/flask run --host=0.0.0.0 --port 5001
```

## Run the Users Microservice

```
cd /home/vagrant/microUsers
export FLASK_APP=run.py
/usr/local/bin/flask run --host=0.0.0.0 --port 5002
```
