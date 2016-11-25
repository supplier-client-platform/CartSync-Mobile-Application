/**
* DB-Access Module
*/
"use strict";
angular.module('db-access', [])
	.factory('$dbService', ['$q', function($q){
		return {
			openDataConnection: function(){
				try{
					var db = window.sqlitePlugin.openDatabase({name:'onthego.db'});
					return {
						init: function(callBack){
							this.createTables(callBack);
						},

						executeQuery: function(query, values){
							var deferred = $q.defer();
							db.transaction(function(tx){
								tx.executeSql(query, values, function(tx, results) {
									deferred.resolve(results);
								}, function(tx, e){
									console.log("There has been an error: " + e.message);
									deferred.reject();
								});
							});
							return deferred.promise;
						},

						createTables: function(callBack){
                //
                // this.executeQuery('CREATE TABLE IF NOT EXISTS `device_videos` (id INTEGER primary key NOT NULL, eventid  INTEGER NOT NULL, footageid  INTEGER NOT NULL, filepath  TEXT NOT NULL, filename  TEXT NOT NULL, is_uploaded  INTEGER NOT NULL DEFAULT 0, is_uploading  INTEGER NOT NULL DEFAULT 0, is_failed  INTEGER NOT NULL DEFAULT 0)', [])
                // .then(function(data){
                // 	console.log("`device_videos` table created!");
                // });
                //
                // this.executeQuery('CREATE TABLE IF NOT EXISTS `recorded_tags` (id INTEGER primary key NOT NULL, eventid INTEGER NOT NULL, userId INTEGER NOT NULL, taggedTime TEXT NOT NULL, geoloc TEXT NOT NULL, is_uploaded INTEGER NOT NULL DEFAULT 0)', [])
                // .then(function(data){
                // 	console.log("`recorded_tags` table created!");
                // });

                this.executeQuery('CREATE TABLE IF NOT EXISTS `user_data` (uid TEXT, displayName TEXT, telephone INTEGER, email TEXT, id INTEGER)', [])
                .then(function(data){
                	console.log("`user_data` table created!" + JSON.stringify(data));
                	callBack();
                });
								this.executeQuery('CREATE TABLE IF NOT EXISTS `favourites` (storeId NUMBER, itemId TEXT)', [])
								.then(function(data){
									console.log("`favourites` table created!" + JSON.stringify(data));
									callBack();
								});

						},

            cleanData: function(){
              this.executeQuery('DELETE FROM `user_data`', [])
              .then(function(data){
                console.log("`user_data` table is cleared!");
              });

							this.executeQuery('DELETE FROM `favourites`', [])
							.then(function(data){
								console.log("`favourites` table is cleared!");
							});
            },

						dropTables: function(){
              this.executeQuery('DROP TABLE `user_data`', [])
              .then(function(data){
                console.log("`user_data` table is dropeed!");
              });

							this.executeQuery('DROP TABLE `favourites`', [])
							.then(function(data){
								console.log("`favourites` table is dropeed!");
							});
            },

						// insertVideos: function(eventId, footageId, fileName, filePath){
						// 	return this.executeQuery('INSERT INTO `device_videos` (eventid, footageid, filename, filepath) VALUES(?,?,?,?)', [eventId, footageId, fileName, filePath]);
            //
						// },
            //
						// getSettings: function(id){
						// 	return this.executeQuery('SELECT * FROM `app_settings` WHERE id=?',[id]);
						// },
            //
						// updateSettings: function(id, values){
						// 	return this.executeQuery('UPDATE `app_settings` SET value=? WHERE id=?',[values, id]);
						// },
						deleteFavourite: function(storeId, itemId){
							return this.executeQuery('DELETE FROM `favourites` WHERE storeId = ? AND itemId = ?',[storeId, itemId]);
						},
						insertFavourite: function(storeId, itemId){
							return this.executeQuery('INSERT INTO `favourites` (storeId, itemId) VALUES(?,?)',[storeId, itemId]);
						},
						insertUser: function(uid,displayName,telephone,email,id){
							return this.executeQuery('INSERT INTO `user_data` (uid, displayName, telephone, email,id) VALUES(?,?,?,?,?)',[uid,displayName,telephone,email,id]);
						},
            getUserData: function(){
            	return this.executeQuery('SELECT * FROM `user_data`',[]);
            },
            getFavourites: function(storeId){
            	return this.executeQuery('SELECT * FROM `favourites` WHERE storeId=?',[storeId]);
            }
					};
				}catch(err){
					console.log("DB ERROR" + err);
				}
			}
		};
	}]);
