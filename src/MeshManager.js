var sceneGraph = require("@nathanfaucett/scene_graph");


var ComponentManager = sceneGraph.ComponentManager,
    MeshManagerPrototype;


module.exports = MeshManager;


function MeshManager() {
    ComponentManager.call(this);
}
ComponentManager.extend(MeshManager, "mesh.MeshManager");
MeshManagerPrototype = MeshManager.prototype;

MeshManagerPrototype.sortFunction = function(a, b) {
    return a.geometry !== b.geometry ? 1 : (a.material !== b.material ? 1 : 0);
};