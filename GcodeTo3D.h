#pragma once

#include <QObject>
#include <QVariant>
#include <QVector4D>
#include <QTextStream>
#include <QFile>
#include <cmath>

template <typename T>
QList<QVariant> toVariantList( const QList<T> &list )
{
    QList<QVariant> newList;
    foreach( const T &item, list )
        newList << item;

    return newList;
}

class GcodeTo3D : public QObject
{
    Q_OBJECT

public:
    GcodeTo3D(QObject *parent = 0);
    virtual ~GcodeTo3D();

public:
    Q_INVOKABLE void output(QString url);

public slots:
    void read(QString localFile);
signals:
    void percentUpdate(QVariant percent);
    void posUpdate(QList<QVariant> pos);

private:
    QThread *thread;
};

class FileLoader : public QObject
{
    Q_OBJECT

public:
    FileLoader(QString fileName, QObject *parent = nullptr):
        QObject(parent),
        file(new QFile(fileName))
    {
    };

    ~FileLoader()
    {
    };

private:
    QFile* file;

signals:
    void update(QVariant var);
    void posFinished(QList<QVariant> pos);

public slots:
    void run()
    {
        QList<QVector4D> pos;
        qint64 totalSize = file->bytesAvailable();
        qint64 stillSize = totalSize;
        float lastPerc = 0.0;
        if (file->open(QIODevice::ReadOnly))
        {
            QTextStream in(file);
            while (!in.atEnd())
            {
                //Get each line
                QString line = in.readLine();
                stillSize -= line.size() + 1; // +1 endl
                float perc = (totalSize -  stillSize)*100.0/totalSize;
                //qDebug() << perc;
                if(perc - lastPerc > 0.25) {
                    emit update((int)perc);
                    lastPerc = perc;
                }
                line = line.simplified();
                //Is it a comment ? Drop it
                if (line.isEmpty())
                    continue;
                else
                {
                    //Remove comment in the end of command
                    if (line.indexOf(";") != -1)
                    {
                        line.resize(line.indexOf(";"));
                        //Remove trailing spaces
                        line = line.simplified();
                    }

                    //Split command and args
                    QStringList commAndArgs = line.split(' ');

                    if (commAndArgs[0] == "G1")
                    {
                        QVector4D ActualPos;
                        //Compute args
                        commAndArgs.removeFirst();
                        for(auto element: commAndArgs)
                        {
                            if(element[0] == 'X')
                                ActualPos.setX(element.remove(0, 1).toFloat());

                            if(element[0] == 'Y')
                                ActualPos.setY(element.remove(0, 1).toFloat());

                            if(element[0] == 'Z')
                                ActualPos.setZ(element.remove(0, 1).toFloat());

                            if(element[0] == 'E')
                                ActualPos.setW(element.remove(0, 1).toFloat());
                        }

                        if(!pos.isEmpty())
                        {
                            if(!line.contains("X"))
                                ActualPos.setX(pos.last().x());
                            if(!line.contains("Y"))
                                ActualPos.setY(pos.last().y());
                            if(!line.contains("Z"))
                                ActualPos.setZ(pos.last().z());
                            if(!line.contains("E"))
                                ActualPos.setW(pos.last().w());
                        }

                        pos.append(ActualPos);
                    }
                }
            }
            emit update(100);
            file->close();
            emit posFinished(toVariantList(pos));
        }
    };
};
