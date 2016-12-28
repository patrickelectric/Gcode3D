cmake_minimum_required(VERSION 2.6)
project(gcodeto3d)
find_package(Qt5 COMPONENTS Core Qml Quick REQUIRED)

if(CMAKE_COMPILER_IS_GNUCC OR CMAKE_COMPILER_IS_GNUXX)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")
endif()

include_directories(${QT_INCLUDES} ${CMAKE_CURRENT_BINARY_DIR})

qt5_add_resources(qml_QRC main.qrc)

set(GcodeTo3D_SRCS GcodeTo3D.cpp main.cpp ${qml_QRC})

add_executable(gcodeto3d ${GcodeTo3D_SRCS})
set_target_properties(gcodeto3d PROPERTIES AUTOMOC ON)
#target_link_libraries(gcodeto3d ${QT_QTCORE_LIBRARY})
target_link_libraries(gcodeto3d PUBLIC Qt5::Core Qt5::Qml Qt5::Quick)

install(TARGETS gcodeto3d RUNTIME DESTINATION bin)
