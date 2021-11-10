require("dotenv").config();

const { CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

let nextEmp = 5

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
        sequelize.query(`*****YOUR CODE HERE*****
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    getAllClients: (req, res) => {
        sequelize.query(`SELECT * FROM cc_users
        JOIN cc_clients
        ON cc_clients.user_id = cc_users.user_id;`)
        .then(dbRes => res.status(200).send(dbRes[0]))

    },
    getPendingAppointments: (req, res) => {
        sequelize.query(`SELECT * FROM cc_appointments
        WHERE approved = 'f'
        ORDER BY date;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },
    getPastAppointments: (req, res) => {
        sequelize.query(``)
    }
}


// Next, you’ll be writing a query that’s similar to the triple join query from getUpcomingAppointments, reference it as you write yours. This one will get all of the past appointments.

// Using sequelize.query query your database for the following columns from their respective tables cc_appointments: appt_id, date, service_type, notes. cc_users: first_name, last_name. Reference the getUpcomingAppointments function to see how to join all the information together (you’ll need all the same tables again). Make sure to select only rows where both the approved and completed values are true. And order the results by date with the most recent at the top.

// Handle the promise with .then() passing in a callback: dbRes => res.status(200).send(dbRes[0]) (you can also add a .catch)

// In index.js, comment line 25 back in (this line: app.get('/appt', getPastAppointments))

// In home.js (public folder), comment lines 108 and 109 back in (these lines: getUpcomingAppointments() and getPastAppointments())

// Navigate to home.html in your browser

// Now you should be able to see all the past appointments as well as the pending ones.