
class MerryGoRound {
    constructor(gl, program) {
        this.program = program;
        this.gl = gl;
        this.cone = new Cone(9, gl, program, 0);
        this.horses = [];

        this.baseXform = mult(translate(0, 0.1, 0), scalem(5, -.1, 5));
        this.topXform = mult(translate(0, 5, 0), scalem(5, 2, 5));

        var horseScale = scalem(.75, 2, .75);

        var horseTranslations = [[4, 2.5, 1], [1, 2.5, -4], [-4, 2.5, -1], [-1, 2.5, 4]];
        var horseAxes = [[-1, 0, 0], [0, 0, 1], [1, 0, 0], [0, 0, -1]];
        var horseColors = [[1, 0.5, 0], [0, 1, 0.5], [0.5, 0, 1], [0.5, 0.5, 0.5]];

        this.horseXform = [];
        for (var i = 0; i < 4; i++) {
            var horseTranslation = translate(horseTranslations[i][0],
                                             horseTranslations[i][1],
                                             horseTranslations[i][2]);
            var horseRotation = rotate(90, horseAxes[i]);
            var Xform = mult(horseRotation, horseScale);
            this.horseXform[i] = mult(horseTranslation, Xform);

            this.horses[i] = new Cone(9, gl, program, horseColors[i]);
        }
        return;
    }

    render(time, position) {
        var MGR_rotation = rotateY(time);
        var MGR_translation = mat4();
        if (Array.isArray(position) && position.length == 4)
            MGR_translation = translate(position[0], position[1], position[2], position[3]);

        var MGR_Xform = mult(MGR_translation, MGR_rotation);

        var vTransformation = gl.getUniformLocation(program, "vTransformation");
        var transformation = mult(MGR_Xform, this.baseXform);
        gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        this.cone.render();

        transformation = mult(MGR_Xform, this.topXform);
        gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        this.cone.render();

        for (var i = 0; i < 4; i++) {
            transformation = mult(translate(0, Math.sin(0.05 * (time + i * 90)), 0), this.horseXform[i]);
            transformation = mult(MGR_Xform, transformation);
            gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
            this.horses[i].render();
        }
        return;
    }
}