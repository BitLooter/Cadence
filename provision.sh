#! /bin/bash

sudo apt-get -y install python-pip ffmpeg
sudo pip install -r /vagrant/reqs.txt
sudo echo "#!/bin/sh" > /etc/rc.local
sudo echo "sudo -u vagrant /home/vagrant/startserver.sh" >> /etc/rc.local
sudo echo "exit 0" >> /etc/rc.local
echo "#!/bin/sh" > /home/vagrant/startserver.sh
# Wait for /vagrant to be mounted
echo "while [ ! -f /vagrant/manage.py ]; do sleep 1; done" >> /home/vagrant/startserver.sh
echo "cd /vagrant" >> /home/vagrant/startserver.sh
echo "/usr/bin/python manage.py runserver 0.0.0.0:8000 2> /home/vagrant/cadenceout &" >> /home/vagrant/startserver.sh
chmod 755 /home/vagrant/startserver.sh
# Create default directories
sudo -u vagrant mkdir /home/vagrant/albumart
sudo -u vagrant mkdir /home/vagrant/transcodes
# Start everything after initial boot+provision
/etc/rc.local
