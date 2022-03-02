sudo apt-get install libcurl4 openssl liblzma5
sudo mkdir ~/dev/mongodb-linux-x86_64-ubuntu2004-5.0.6
tar -zxvf mongodb-linux-x86_64-ubuntu2004-5.0.6.tgz --directory ~/dev/mongodb-linux-x86_64-ubuntu2004-5.0.6
sudo ln -s  ~/dev/mongodb-linux-x86_64-ubuntu2004-5.0.6/bin/* /usr/local/bin/