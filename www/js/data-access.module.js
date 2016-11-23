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

                this.executeQuery('CREATE TABLE IF NOT EXISTS `user_data` (uid TEXT PRIMARY KEY NOT NULL, displayName TEXT, telephone INTEGER, email TEXT)', [])
                .then(function(data){
                	console.log("`user_data` table created!" + JSON.stringify(data));
                	callBack();
                });

						},

            cleanData: function(){
              this.executeQuery('DELETE FROM `user_data`', [])
              .then(function(data){
                console.log("`user_data` table is cleared!");
              });
            },

						dropTables: function(){
              this.executeQuery('DROP TABLE `user_data`', [])
              .then(function(data){
                console.log("`user_data` table is dropeed!");
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

						insertUser: function(uid,displayName,telephone,email){
							return this.executeQuery('INSERT INTO `user_data` (uid, displayName, telephone, email) VALUES(?,?,?,?)',[uid,displayName,telephone,email]);
						},
            getUserData: function(){
            	return this.executeQuery('SELECT * FROM `user_data`',[]);
            }
					};
				}catch(err){
					console.log("DB ERROR" + err);
				}
			}
		};
	}]);
