const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

const router = express.Router();

exports.setSubject = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try{
        if (!req.body.SubjectName) {
            res.json({ status: 0, message: "Please Enter SubjectName", data: null, error: null });
        }
        else if (!req.body.CourseID) {
            res.json({ status: 0, message: "Please Enter CourseID", data: null, error: null });
        }
        
        else {
            await Connection.connect();

            var data = [
                {name:'Query' , value: req.body.SubjectID ? 'Update' : 'Insert'},
                {name : 'SubjectName' , value : req.body.SubjectName ? req.body.SubjectName : null},
                {name : 'SubjectID' , value : req.body.SubjectID ? req.body.SubjectID : null},
                {name : 'AdminID' , value : req.body.AdminID ? req.body.AdminID : null},
                {name : 'CourseID' , value : req.body.CourseID ? req.body.CourseID : null}
              
            ]

            try{
                const result = await dataAccess.execute(`SP_Subject`, data);
                if (result.rowsAffected == 1) {
                    if (!req.body.SubjectID) {
                        res.redirect('/')
                    }
                    else {
                        res.redirect('/')
                    }
            }
            else{
                res.status(200).json({ status: 0, message: "Can't able to Find ID", data: null, error: null });
            }

        }
        catch(error){
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
        }
    }
}
catch(error){
    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
}
}}
];



exports.getSubject = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'SubjectID', value: (req.body.SubjectID) ? (req.body.SubjectID) : null },
            { name: 'AdminID', value: (req.body.AdminID) ? (req.body.AdminID) : null },
            { name: 'CourseID', value: (req.body.CourseID) ? (req.body.CourseID) : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Subject`, data);
        if (result.recordset && result.recordset[0]) {
            const Subjectdata = result.recordset;
            if (Subjectdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: Subjectdata, error: null });
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}];

exports.addSubject = async(req,res) =>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {
        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;

        await Connection.connect();
        var data01 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value:null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Department`, data01);
        const data = result.recordset


        if (result.recordset && result.recordset[0]) {
            const Subjectdata = result.recordset;
            if (Subjectdata.length > 0) {
                res.render('Panel/add-subject',{name,id,type,data})
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
    }
}


exports.allSubject = async(req,res) =>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {
        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;

        await Connection.connect();
        var data01 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'SubjectID', value:null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Subject`, data01);
        const data = result.recordset


        if (result.recordset && result.recordset[0]) {
            const Subjectdata = result.recordset;
            if (Subjectdata.length > 0) {
                res.render('Panel/subject-view',{name,id,type,data})
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
    }
}


exports.editSubject = async(req,res) =>{

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{

    try {
        const name = req.cookies.UserData[0].Name;
        const id = req.cookies.UserData[0].UserID;
        const type = req.cookies.UserData[0].UserType;

        await Connection.connect();
        var data01 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'DepartmentID', value:null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result1 = await dataAccess.execute(`SP_Department`, data01);
        const data = result1.recordset


        await Connection.connect();
        var data02 = [
            { name: 'Query', value: 'SelectAll' },
            { name: 'SubjectID', value:req.body.SubjectID },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const result = await dataAccess.execute(`SP_Subject`, data02);
        const data1 = result.recordset


        if (result.recordset && result.recordset[0]) {
            const Subjectdata = result.recordset;
            if (Subjectdata.length > 0) {
                res.render('Panel/edit-subject',{name,id,type,data,data1})
            }
            else {
                res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
            }
        }
        else {
            res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }

}
}



exports.removeSubject = [async (req, res) => {

    if(!req.cookies.UserData){
        res.redirect('/Login')
    }else{
    try {
        

            await Connection.connect();
          
            var data = [
                { name: 'Query', value: 'Delete' },
                { name: 'SubjectID', value: req.params.id },
                { name: 'IsDelete', value: true }
            ]
            const result = await dataAccess.execute(`SP_Subject`, data);
            if (result.rowsAffected == 1) {
                
                 res.redirect('/allSubject')
            }
            else {
                res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
            }
        
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}
}]