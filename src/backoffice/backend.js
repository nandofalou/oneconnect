import { ipcRenderer, ipcMain, BrowserWindow } from 'electron'
import model from './model'
import ws from './ws.js'

const backend = {
    win: BrowserWindow,
    db: model,
    ws: ws,
    init: (win) => {
        backend.win = win
        backend.ws.win = win
        backend.db.init()
        backend.listen()
    },
    // start: () => {
    //     ws.init('api.ws.cloudid.com.br', 9000, false, (data) => {
    //         console.log("xxx", data);
    //         let params = {
    //             event_id: 1,
    //             event_hash: "C47124",
    //             client_hash: "a941a999217ef99500aa0d57b2861c40"
    //           }
    //           ws.sendData("AUTH.LOGIN", params, function (data) {
    //             console.log("return data login", data);
    //           })
    //     });
    // },
    listen: () => {
        ipcMain.on('WSSETUP', (event, data) => {
            ws.init(data, () => {
                console.log('callback:', data)
            });
        })

        ipcMain.on('WSLOGIN', (event, data) => {
            ws.sendLogin()
        })

        ipcMain.on('WSDATA', (event, data) => {
            ws.sendData(data.method, data.params, function (response) {
                console.log("return data", response);
                event.reply('WS.DATA', response)
            })
        })
        ipcMain.on('COUNTTICKET', (event, data) => {
            backend.db.query("select count(id) as qtd from ticket;",(err2, row)=>{
                console.log('qtd tickets: ', row[0].qtd)
                event.reply('WS.DATA', row[0].qtd)
            });
        })
        ipcMain.on('GETALL', (event, data) => {
            ws.sendData(data.method, data.params, function (response) {
                // evento 
                const event = response.sync.event
                console.log('event:', event)
                backend.getEventById(event.id, (err, rows) => {
                    if (err || rows.length === 0) {
                        backend.addEvent(event, (res) => {
                            backend.win.webContents.send('EVENT', "Evento Criado ")

                            // event.reply('EVENT', 'Evento Criado')
                        })
                    } else {
                        backend.updateEvent(event, (res) => {
                            backend.win.webContents.send('EVENT', "Evento Atualizado ")
                            // event.reply('EVENT', 'Evento Atualizado')
                        })
                    }
                })
                backend.syncCategoryIn(response.sync)
                backend.syncStatusIn(response.sync)
                backend.syncFieldIn(response.sync)
                backend.syncTicketIn(response.sync)
            })
        })

        ipcMain.on('GETEVENT', (event, data) => {
            backend.getEventById(data.event.id, (err, rows) => {
                if (err || rows.length === 0) {
                    backend.addEvent(data.event, (res) => {
                        event.reply('EVENT', 'Evento Criado')
                    })
                } else {
                    backend.updateEvent(data.event, (res) => {
                        event.reply('EVENT', 'Evento Atualizado')
                    })
                }
            })
        })

        ipcMain.on('GETCATEGORY', (event, data) => {
            data.category.forEach(category => {
                backend.getCategoryById(category.id, (err, rows) => {
                    if (err || rows.length === 0) {
                        backend.addCategory(category, (res) => {
                            event.reply('CATEGORY', 'categorias Criadas')
                        })
                    } else {
                        backend.updateCategory(category, (res) => {
                            event.reply('CATEGORY', 'categorias Atualizadas')
                        })
                    }
                })
            });
        })

        ipcMain.on('GETFIELD', (event, data) => {
            data.field.forEach(el => {
                backend.getFieldById(el.id, (err, rows) => {
                    if (err || rows.length === 0) {
                        backend.addField(el, (res) => {
                            event.reply('FIELD', 'Campos Criadas')
                        })
                    } else {
                        backend.updateField(el, (res) => {
                            event.reply('FIELD', 'Campos Atualizadas')
                        })
                    }
                })
            });
        })

        ipcMain.on('GETSTATUS', (event, data) => {
            data.status.forEach(el => {
                backend.getStatusById(el.id, (err, rows) => {
                    if (err || rows.length === 0) {
                        backend.addStatus(el, (res) => {
                            event.reply('STATUS', 'Status Criadas')
                        })
                    } else {
                        backend.updateStatus(el, (res) => {
                            event.reply('STATUS', 'Status Atualizadas')
                        })
                    }
                })
            });
        })

        ipcMain.on('GETTICKET', (event, data) => {
            if (Array.isArray(data.ticket)) {
                for (let t = 0; t <= (data.ticket.length - 1); t++) {
                    let ticket = data.ticket[t]
                    let sync = data.sync
                    backend.getTicketById(ticket, (err, rows) => {
                        if (rows.length > 0) {
                            backend.updateTicket(ticket, sync, rows[0], (err, res) => {
                                backend.win.webContents.send('TICKET', "UPDATE ....... " + rows[0].id)
                            })
                            // console.log('update', {ticket, sync, rows:rows[0], err:err})
                        } else if (rows.length === 0) {
                            // console.log('insert', {ticket, sync, rows:rows, err:err})
                            backend.addTicket(ticket, sync, (res) => {
                                backend.win.webContents.send('TICKET', "INSERT ....... " + res)
                            })
                        } else {
                            backend.win.webContents.send('TICKET', " Nada...")
                        }
                    })
                }
            } else {
                let ticket = data.ticket
                let sync = data.sync
                backend.getTicketById(ticket, (err, rows) => {
                    if (rows.length > 0) {
                        backend.db.query("begin transaction;",(err1)=>{
                            backend.updateTicket(ticket, sync, rows[0], (err, res) => {
                                backend.db.query("commit;",(err2)=>{
                                    console.log(err2)
                                });
                            })
                        });
                    } else if (rows.length === 0) {
                        backend.db.query("begin transaction;",(err1)=>{
                            backend.addTicket(ticket, sync, (res) => {
                                backend.db.query("commit;",(err2)=>{
                                    console.log(err2)
                                });
                            })
                        });
                    } else {
                        backend.win.webContents.send('TICKET', " Nada...")
                    }
                })
            }

            // event.reply('TICKET', 'Ticket Criadas ')
        })
        // ipcMain.on('GETTICKET', (event, data) => {
        //     let tickets = []
        //     for(let t=0; t<= (data.ticket.length - 1); t++) {

        //         console.log('ticket', data.ticket[t])
        //         tickets.push(backend.aTicket(data.ticket[t]));
        //     }


        //     backend.db.insertBath('ticket', tickets, (res) => {
        //         console.log('insertBath: ',res)
        //     })

        //    // event.reply('TICKET', 'Ticket Criadas ')


        // })

    },

    syncCategoryIn: (data) => {
        data.category.forEach(category => {
            backend.getCategoryById(category.id, (err, rows) => {
                if (err || rows.length === 0) {
                    backend.addCategory(category, (res) => {
                        backend.win.webContents.send('CATEGORY', "categorias Criadas ")

                    })
                } else {
                    backend.updateCategory(category, (res) => {
                        backend.win.webContents.send('CATEGORY', "categorias Atualizadas ")

                    })
                }
            })
        });
    },

    syncFieldIn: (data) => {
        data.field.forEach(el => {
            backend.getFieldById(el.id, (err, rows) => {
                if (err || rows.length === 0) {
                    backend.addField(el, (res) => {
                        backend.win.webContents.send('FIELD', "Campos Criadas ")
                    })
                } else {
                    backend.updateField(el, (res) => {
                        backend.win.webContents.send('FIELD', "Campos Atualizadas ")
                    })
                }
            })
        });
    },

    syncStatusIn: (data) => {
        data.status.forEach(el => {
            backend.getStatusById(el.id, (err, rows) => {
                if (err || rows.length === 0) {
                    backend.addStatus(el, (res) => {
                        backend.win.webContents.send('STATUS', "Status Criadas ")
                    })
                } else {
                    backend.updateStatus(el, (res) => {
                        backend.win.webContents.send('STATUS', "Status Atualizadas ")
                    })
                }
            })
        });
    },

    syncTicketIn: (data) => {
        for (let t = 0; t <= (data.ticket.length - 1); t++) {
            let ticket = data.ticket[t]
            let sync = data.sync
            backend.getTicketById(ticket, (err, rows) => {
                
                if (rows.length > 0) {
                    backend.db.query("begin transaction;",(err1)=>{
                        backend.updateTicket(ticket, sync, rows[0], (err, res) => {
                            backend.db.query("commit;",(err2)=>{
                                console.log(err2)
                            });
                        })
                    });
                    
                    // console.log('update', {ticket, sync, rows:rows[0], err:err})
                } else if (rows.length === 0) {
                    backend.db.query("begin transaction;",(err1)=>{
                        backend.addTicket(ticket, sync, (res) => {
                            backend.db.query("commit;",(err2)=>{
                                console.log(err2)
                            });
                        })
                    });
                } else {
                    backend.win.webContents.send('TICKET', " Nada...")
                }
                
            })
        }
        backend.win.webContents.send('TICKET', " fim...")
    },




    isNumber: (value) => {
        return typeof value === 'number' && isFinite(value);
    },


    // *********** EVENT *****************
    getEventById: (id, callBack) => {
        backend.db.get({
            filter: ` id = ${id} `,
            limit: 1,
            table: 'event'
        }, callBack)
    },

    addEvent: (data, call) => {
        backend.db.insert('event',
            {
                'id': data.id,
                'name': data.name,
                'local': data.local,
                'active': data.active,
                'start_date': data.start_date,
                'end_date': data.end_date,
                'created_at': data.created_at,
                'updated_at': data.updated_at
            }
            , call)
    },

    updateEvent: (data, result) => {
        const fields = {
            'id': data.id,
            'name': data.name,
            'local': data.local,
            'active': data.active,
            'start_date': data.start_date,
            'end_date': data.end_date,
            'created_at': data.created_at,
            'updated_at': data.updated_at
        }

        backend.db.update('event', fields, 'id = ' + data.id, (err, res) => {
            if (err) {
                console.log(err);
                result(err, false);
            } else {
                result(null, res);
            }
        });
    },

    // *********** Category *****************
    getCategoryById: (id, callBack) => {
        backend.db.get({
            filter: `id = ${id}`,
            limit: 1,
            table: 'category'
        }, callBack)
    },

    addCategory: (data, call) => {

        backend.db.insert('category',
            {
                'id': data.id,
                'event_id': data.event_id,
                'name': data.name,
                'start_date': data.start_date,
                'end_date': data.end_date,
                'active': parseInt(data.active)
            }
            , call)
    },

    updateCategory: (data, result) => {
        const fields = {
            'id': data.id,
            'event_id': data.event_id,
            'name': data.name,
            'start_date': data.start_date,
            'end_date': data.end_date,
            'active': parseInt(data.active)
        }
        backend.db.update('category', fields, 'id = ' + data.id, (err, res) => {
            if (err) {
                console.log(err);
                result(err, false);
            } else {
                result(null, res);
            }
        });
    },


    // *********** Field *****************
    getFieldById: (id, callBack) => {
        backend.db.get({
            filter: `id = ${id}`,
            limit: 1,
            table: 'field'
        }, callBack)
    },

    addField: (data, call) => {
        backend.db.insert('field',
            {
                'id': data.id,
                'event_id': data.event_id,
                'type': data.type,
                'name': data.name,
                'label': data.label,
                'vls': data.values,
                'placeholder': data.placeholder,
                'mask': data.mask,
                'required': data.required,
                'sequence': data.sequence
            }
            , call)
    },

    updateField: (data, result) => {
        const fields = {
            'id': data.id,
            'event_id': data.event_id,
            'type': data.type,
            'name': data.name,
            'label': data.label,
            'vls': data.values,
            'placeholder': data.placeholder,
            'mask': data.mask,
            'required': data.required,
            'sequence': data.sequence
        }

        backend.db.update('field', fields, 'id = ' + data.id, (err, res) => {
            if (err) {
                console.log(err);
                result(err, false);
            } else {
                result(null, res);
            }
        });
    },


    // *********** STATUS *****************
    getStatusById: (id, callBack) => {
        backend.db.get({
            filter: `id = ${id}`,
            limit: 1,
            table: 'status'
        }, callBack)
    },

    addStatus: (data, call) => {
        backend.db.insert('status',
            {
                'id': data.id,
                'name': data.name
            }
            , call)
    },

    updateStatus: (data, result) => {
        const fields = {
            'id': data.id,
            'name': data.name
        }

        backend.db.update('status', fields, 'id = ' + data.id, (err, res) => {
            if (err) {
                console.log(err);
                result(err, false);
            } else {
                result(null, res);
            }
        });
    },


    // *********** Ticket *****************
    getTicketById: (ticket, callBack) => {
        backend.db.get({
            filter: ` cod = ${ticket.cod} and event_id = ${ticket.event_id} `,
            limit: 1,
            table: 'ticket'
        }, callBack)
    },

    addTicket: (data, sync, call) => {
        if (data.id > 0 && data.cod.length > 0) {

            backend.db.query(`SELECT id FROM ticket where cod = '${data.cod}' AND event_id = '${data.event_id}';`, (err, rows) => {
                if (err || rows.length < 1) {
                    backend.db.insert('ticket',
                        {
                            'server_id': data.id,
                            'event_id': data.event_id,
                            'category_id': data.category_id,
                            'status_id': data.status_id,
                            'status_text': data.status_text,
                            'cod': data.cod,
                            'image': data.image,
                            'multipass': data.multipass,
                            'active': data.active,
                            'device_id': data.device_id,
                            'client_sync_id': data.client_sync_id,
                            'reading_at': data.reading_at,
                            'updated_at': data.updated_at,
                            'created_at': data.created_at,
                            'send_at': backend.db.getNow(),
                            'sync': sync
                        }
                        , call)
                } else {
                    call(null)
                }
            })
        } else {
            call(null)
        }
    },

    updateTicket: (data, sync, row, result) => {
        if (row.updated_at > data.updated_at) {
            result(null, null);
        } else {
            const fields = {
                'server_id': data.id,
                'category_id': data.category_id,
                'status_id': data.status_id,
                'status_text': data.status_text,
                'image': data.image,
                'multipass': data.multipass,
                'active': data.active,
                'device_id': data.device_id,
                'client_sync_id': data.client_sync_id,
                'reading_at': data.reading_at,
                'updated_at': data.updated_at,
                'created_at': data.created_at,
                'send_at': backend.db.getNow(),
                'sync': sync
            }

            backend.db.update('ticket', fields, `cod = '${data.cod}' and event_id = '${data.event_id}' `, (err, res) => {
                if (err) {
                    console.log(err);
                    result(err, false);
                } else {
                    result(null, res);
                }
            });
        }
    },

    upTicket: (data, sync) => {
        return {
            'server_id': data.id,
            'event_id': data.event_id,
            'category_id': data.category_id,
            'status_id': data.status_id,
            'status_text': data.status_text,
            'cod': data.cod,
            'image': data.image,
            'multipass': data.multipass,
            'active': data.active,
            'device_id': data.device_id,
            'client_sync_id': data.client_sync_id,
            'reading_at': data.reading_at,
            'created_at': data.created_at,
            'send_at': backend.db.getNow(),
            'sync': sync
        }

    },

    aTicket: (data, sync) => ({
        'server_id': data.id,
        'event_id': data.event_id,
        'category_id': data.category_id,
        'status_id': data.status_id,
        'status_text': data.status_text,
        'cod': data.cod,
        'image': data.image,
        'multipass': data.multipass,
        'active': data.active,
        'device_id': data.device_id,
        'client_sync_id': data.client_sync_id,
        'reading_at': data.reading_at,
        'created_at': data.created_at,
        'send_at': backend.db.getNow(),
        'sync': sync
    })

}

export default backend
