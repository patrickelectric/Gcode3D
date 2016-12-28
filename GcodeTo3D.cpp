#include "GcodeTo3D.h"

#include <QDebug>
#include <QFile>
#include <QVector4D>
#include <QThread>
#include <QUrl>

GcodeTo3D::GcodeTo3D(QObject *parent) :
    QObject(parent)
{
}

GcodeTo3D::~GcodeTo3D()
{
}

void GcodeTo3D::output(QString url)
{
    thread = new QThread;
    auto fileLoader = new FileLoader(QUrl(url).path());
    fileLoader->moveToThread(thread);
    connect(fileLoader, &FileLoader::update ,this, &GcodeTo3D::percentUpdate);
    connect(fileLoader, &FileLoader::posFinished ,this, &GcodeTo3D::posUpdate);
    connect(thread, &QThread::started, fileLoader, &FileLoader::run);
    thread->start();
}

void GcodeTo3D::read(QString localFile)
{
}
