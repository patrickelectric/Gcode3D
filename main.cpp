#include <QGuiApplication>
#include <QtQuick/QQuickView>
#include "GcodeTo3D.h"


int main(int argc, char** argv)
{
    QGuiApplication app(argc, argv);

    qmlRegisterType<GcodeTo3D>("GcodeTo3D", 1, 0, "GcodeTo3D");

    QQuickView view;
    view.setResizeMode(QQuickView::SizeRootObjectToView);
    view.setSource(QUrl("qrc:///main.qml"));
    return app.exec();
}
