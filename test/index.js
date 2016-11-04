var tape = require("tape"),
    sceneGraph = require("@nathanfaucett/scene_graph"),
    Geometry = require("@nathanfaucett/geometry"),
    transformComponents = require("@nathanfaucett/transform_components"),
    mesh = require("..");


var Scene = sceneGraph.Scene,
    Entity = sceneGraph.Entity,
    Transform3D = transformComponents.Transform3D,
    Mesh = mesh.Mesh;


tape("Mesh", function(assert) {
    var scene = Scene.create(),
        transform = Transform3D.create(),
        geometry = Geometry.create(),
        mesh = Mesh.create({
            geometry: geometry
        }),
        entity = Entity.create().addComponent(transform, mesh),
        manager;

    scene.addEntity(entity);
    manager = scene.getComponentManager("mesh.Mesh");

    scene.init();

    assert.equals(mesh.geometry, geometry);

    assert.end();
});