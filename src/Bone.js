var vec3 = require("@nathanfaucett/vec3"),
    quat = require("@nathanfaucett/quat"),
    mat4 = require("@nathanfaucett/mat4"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    sceneGraph = require("@nathanfaucett/scene_graph"),
    BoneManager = require("./BoneManager");


var Component = sceneGraph.Component,
    ComponentPrototype = Component.prototype,
    UNKNOWN_BONE_COUNT = 1,
    BonePrototype;


module.exports = Bone;


function Bone() {

    Component.call(this);

    this.parentIndex = -1;
    this.name = null;

    this.skinned = false;
    this.bindPose = mat4.create();
    this.uniform = mat4.create();

    this.inheritPosition = true;
    this.inheritRotation = true;
    this.inheritScale = true;
}
Component.extend(Bone, "mesh.Bone", BoneManager);
BonePrototype = Bone.prototype;

BonePrototype.construct = function(options) {

    ComponentPrototype.construct.call(this);

    options = options || {};

    this.parentIndex = isNullOrUndefined(options.parentIndex) ? -1 : options.parentIndex;
    this.name = isNullOrUndefined(options.name) ? "Bone" + UNKNOWN_BONE_COUNT++ : options.name;

    this.skinned = isNullOrUndefined(options.skinned) ? false : !!options.skinned;

    if (options.bindPose) {
        mat4.copy(this.bindPose, options.bindPose);
    }

    this.inheritPosition = isNullOrUndefined(options.inheritPosition) ? true : !!options.inheritPosition;
    this.inheritRotation = isNullOrUndefined(options.inheritRotation) ? true : !!options.inheritRotation;
    this.inheritScale = isNullOrUndefined(options.inheritScale) ? true : !!options.inheritScale;

    return this;
};

BonePrototype.destructor = function() {

    ComponentPrototype.destructor.call(this);

    this.parentIndex = null;
    this.name = null;

    this.skinned = null;
    mat4.identity(this.bindPose);
    mat4.identity(this.uniform);

    this.inheritPosition = true;
    this.inheritRotation = true;
    this.inheritScale = true;

    return this;
};

var MAT = mat4.create(),
    POSITION = vec3.create(),
    SCALE = vec3.create(),
    ROTATION = quat.create();

BonePrototype.update = function() {
    var entity = this.entity,
        transform = entity.getComponent("transform.Transform3D") || entity.getComponent("transform.Transform2D"),
        uniform = this.uniform,
        inheritPosition, inheritScale, inheritRotation,
        mat, position, scale, rotation,
        parent;

    mat4.copy(uniform, transform.getLocalMatrix());

    if (this.skinned !== false) {
        parent = entity.parent;

        if (parent && this.parentIndex !== -1) {
            mat = MAT;
            mat4.copy(mat, parent.getComponent("mesh.Bone").uniform);

            inheritPosition = this.inheritPosition;
            inheritScale = this.inheritScale;
            inheritRotation = this.inheritRotation;

            if (!inheritPosition || !inheritScale || !inheritRotation) {
                position = POSITION;
                scale = SCALE;
                rotation = ROTATION;

                mat4.decompose(mat, position, scale, rotation);

                if (!inheritPosition) {
                    vec3.set(position, 0, 0, 0);
                }
                if (!inheritScale) {
                    vec3.set(scale, 1, 1, 1);
                }
                if (!inheritRotation) {
                    quat.set(rotation, 0, 0, 0, 1);
                }

                mat4.compose(mat, position, scale, rotation);
            }

            mat4.mul(uniform, mat, uniform);
        }
    }

    return this;
};