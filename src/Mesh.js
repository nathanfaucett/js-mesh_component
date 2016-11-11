var sceneGraph = require("@nathanfaucett/scene_graph"),
    transformComponents = require("@nathanfaucett/transform_components"),
    Bone = require("./Bone"),
    MeshManager = require("./MeshManager");


var Entity = sceneGraph.Entity,

    Transform2D = transformComponents.Transform2D,
    Transform3D = transformComponents.Transform3D,

    Component = sceneGraph.Component,
    ComponentPrototype = Component.prototype,

    MeshPrototype;


module.exports = Mesh;


function Mesh() {

    Component.call(this);

    this.geometry = null;
    this.material = null;
    this.bones = [];
    this.boneHash = {};
}
Component.extend(Mesh, "mesh.Mesh", MeshManager);
MeshPrototype = Mesh.prototype;

MeshPrototype.construct = function(options) {

    ComponentPrototype.construct.call(this);

    if (options) {
        this.geometry = options.geometry;
        this.material = options.material;
    }

    return this;
};

MeshPrototype.destructor = function() {

    ComponentPrototype.destructor.call(this);

    this.geometry = null;
    this.material = null;
    this.bones.length = 0;
    this.boneHash = {};

    return this;
};

MeshPrototype.init = function() {
    var entity = this.entity,
        Transform = entity.getComponent("transform.Transform3D") ? Transform3D : Transform2D,
        geoBones = this.geometry.bones,
        i = -1,
        il = geoBones.length - 1,
        bones, boneHash, geoBone, bone, transform, childEntity, parent;

    if (il !== -1) {
        entity = this.entity;
        bones = this.bones;
        boneHash = this.boneHash;

        while (i++ < il) {
            geoBone = geoBones[i];
            bone = Bone.create(geoBone);
            transform = Transform.create()
                .setPosition(geoBone.position)
                .setScale(geoBone.scale)
                .setRotation(geoBone.rotation);

            childEntity = Entity.create().addComponent(transform, bone);
            bones[bones.length] = childEntity;
            parent = bones[bone.parentIndex] || entity;
            parent.addChild(childEntity);
            boneHash[bone.name] = childEntity;
        }
    }

    ComponentPrototype.init.call(this);

    return this;
};

MeshPrototype.toJSON = function(json) {

    json = ComponentPrototype.toJSON.call(this, json);

    json.geometry = this.geometry.name;
    json.material = this.material.name;

    return json;
};

MeshPrototype.fromJSON = function(json) {
    var assets = this.entity.scene.application.assets;

    ComponentPrototype.fromJSON.call(this, json);

    this.geometry = assets.get(json.geometry);
    this.material = assets.get(json.material);

    return this;
};