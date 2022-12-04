function getVertexShader(){

    return `
    varying vec3 Normal;
    varying vec3 Position;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        Normal = normalize(normalMatrix * normal);
        Position = vec3(modelViewMatrix * vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    } 
    `;

}

function getFragmentShader(){

    return `
    varying vec3 Normal;
    varying vec3 Position;
    varying vec2 vUv;

    uniform vec3 Ka;
    uniform vec3 Kd;
    uniform vec3 Ks;
    uniform vec4 LightPosition;
    uniform vec3 LightIntensity;
    uniform float Shininess;
    uniform sampler2D meshTexture;

    vec3 phong() {
        vec3 n = normalize(Normal);
        vec3 s = normalize(vec3(LightPosition) - Position);
        vec3 v = normalize(vec3(-Position));
        vec3 r = reflect(-s, n);

        vec3 ambient = Ka;
        vec3 diffuse = Kd * max(dot(s, n), 0.0);
        vec3 specular = Ks * pow(max(dot(r, v), 0.0), Shininess);

        return LightIntensity * (ambient + diffuse + specular);
    }

    void main() {
        gl_FragColor = texture2D(meshTexture, vUv) * vec4(phong(), 1.0);
    }
    `;

}

export { getFragmentShader, getVertexShader };