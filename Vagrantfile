# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "vogtmann/debian-7.5-64"

  config.vm.network "forwarded_port", guest: 8000, host: 8000

  config.vm.synced_folder "./", "/vagrant"
  
  # Disable USB, causes problems on my system and we don't need it
  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--usb", "off"]
  end
  
  config.vm.provision "shell", path: "provision.sh"
end
