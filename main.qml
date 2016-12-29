import QtQuick 2.4
import QtCanvas3D 1.0
import QtQuick.Window 2.2
import GcodeTo3D 1.0
import "glcode.js" as GLCode
import QtQuick.Dialogs 1.0

Window {
    title: qsTr("GCode Visualizer")
    width: 640;    height: 480
    visible: true

    Canvas3D {
        id: canvas3d
        anchors.fill: parent
        focus: true
        onInitializeGL: GLCode.initializeGL(canvas3d);
        onPaintGL: GLCode.paintGL(canvas3d);
        onResizeGL: GLCode.resizeGL(canvas3d);
    }

    Text {
        id: fpsText
        anchors.top: parent.top
        anchors.left: parent.left
        text: canvas3d.fps+" FPS"
        color:"white"
    }

    GcodeTo3D {
        id: aGcodeTo3D
        onPercentUpdate: percentText.text = percent + "%"
        onPosUpdate: GLCode.drawLine(pos)
    }

    Text {
        id: percentText
        anchors.top: parent.top
        anchors.right: parent.right
        text: "0 %"
        color:"white"
    }

     Text {
        id: fileName
        anchors.horizontalCenter: parent.horizontalCenter
        text: ""
        color:"white"
    }

    FileDialog {
        id: fileDialog
        title: "Please choose a file"
        folder: shortcuts.home
        nameFilters: [ "GCode (*.gcode)", "All files (*)" ]
        onAccepted: {
            console.log("You chose: " + fileDialog.fileUrls)
            fileName.text = GLCode.urlToFileName(fileDialog.fileUrl)
            aGcodeTo3D.output(fileDialog.fileUrl)
            Qt.quit()
        }
        onRejected: {
            console.log("Canceled")
            Qt.quit()
        }
    }

    MouseArea {
            anchors.fill: parent
            onDoubleClicked: {
                fileDialog.open()
            }
            onWheel: {
                GLCode.zoom(wheel.angleDelta)
            }
    }
}
