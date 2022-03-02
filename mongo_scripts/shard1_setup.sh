sudo mkdir -p /mnt/crypto/shard1
sudo chmod 777 /mnt/crypto/shard1
mongod --replSet shard1 --logpath "/mnt/crypto/shard1/log.log" --dbpath /mnt/crypto/shard1 --port 27002 --fork --shardsvr --smallfiles &
