const express = require("express")
const router = express.Router()

const itemController = require("../controllers/itemcontroller")
const tagController = require("../controllers/tagController")
const folderController = require("../controllers/folderController")
const otherController = require("../controllers/otherController")

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        next()
    }
    else {
        res.redirect("/login")
    }
}

router.get("/", (req, res, next) => {
    res.redirect("/dashboard")
})







router.get("/register", otherController.register_get)

router.post("/register", otherController.register_post)

router.get("/login", otherController.login_get)

router.post("/login", otherController.login_post)

router.get("/logout", isAuthenticated, otherController.logout)








router.get("/dashboard", isAuthenticated , otherController.dashboard)

router.get("/images/:id", isAuthenticated, itemController.image_get)




router.get("/all-items", isAuthenticated, folderController.folder_list)

router.get("/add-folder", isAuthenticated, folderController.folder_create_get)

router.post("/add-folder", isAuthenticated, folderController.folder_create_post)

router.get("/folder/:id/update", isAuthenticated, folderController.folder_update_get)

router.post("/folder/:id/update", isAuthenticated, folderController.folder_update_post)

router.get("/folder/:id/delete", isAuthenticated, folderController.folder_delete_get)

router.post("/folder/:id/delete", isAuthenticated, folderController.folder_delete_post)







router.get("/tags", isAuthenticated, tagController.tag_list)

router.get("/add-tag", isAuthenticated, tagController.tag_create_get)

router.post("/add-tag", isAuthenticated, tagController.tag_create_post)

router.get("/tag/:id", isAuthenticated, tagController.tag_details)

router.get("/tag/:id/update", isAuthenticated, tagController.tag_update_get)

router.post("/tag/:id/update", isAuthenticated, tagController.tag_update_post)

router.get("/tag/:id/delete", isAuthenticated, tagController.tag_delete_get)

router.post("/tag/:id/delete", isAuthenticated, tagController.tag_delete_post)







router.get("/add-item", isAuthenticated, itemController.item_create_get)

router.post("/add-item", isAuthenticated, itemController.item_create_post)

router.get("/folder/:id/content", isAuthenticated, itemController.item_list)

router.get("/item/:id", isAuthenticated, itemController.item_details)

router.get("/item/:id/update", isAuthenticated, itemController.item_update_get)

router.post("/item/:id/update", isAuthenticated, itemController.item_update_post)

router.get("/item/:id/delete", isAuthenticated, itemController.item_delete_get)

router.post("/item/:id/delete", isAuthenticated, itemController.item_delete_post)


module.exports = router